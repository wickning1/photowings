<script context="module">
  export const SMARTFORM = {}
</script>
<script>
  export let submit
  export let preload = {}
  export let validate = () => ({})
  export let className = 'smartform'
  export let errormessage = 'There was a problem submitting the form.'
  export let debouncetimer = 500
  import { writable, derived } from 'svelte/store'
  import { setContext } from 'svelte'
  import _get from 'lodash/get'
  import _set from 'lodash/set'
  import _ from 'txstate-node-utils/lib/util'
  import { aggressivederived } from '../../../lib/helpers'

  // create a store for the form data, subscribe to it for internal use
  let currentformdata = JSON.parse(JSON.stringify(preload))
  let formversion = 0
  let validatedversion = -1
  let lastjson = ''
  const formdata = writable(currentformdata)
  formdata.subscribe(fd => {
    const json = JSON.stringify(fd)
    if (lastjson !== json) {
      lastjson = json
      currentformdata = fd
      formversion++
    }
  })

  // create a store for whether each input should be showing its validation status
  const showerrors = writable({})

  // create a store of the error messages for each input, subscribe for use
  let currenterrors = {}
  const errors = writable(currenterrors)
  errors.subscribe(errs => currenterrors = errs)

  // keep a list of registered inputs, ordered by DOM insertion order, so that
  // we can show errors *above* a specific input
  let registeredInputs = []

  // if an error happens during submit, we need to display it inside the form
  let submiterror

  async function validatechange (name, delayvalidation) {
    /*** figure out which inputs should be showing errors ***/
    showerrors.update(showerrs => {
      // give the user a brief period of benefit
      // of the doubt until validation finishes, but if
      // validation on this version has already been done, immediately
      // show errors
      showerrs[name] = formversion === validatedversion
      // show errors for any inputs that are above this one in the page
      for (const registeredname of registeredInputs) {
        if (registeredname === name) break
        showerrs[registeredname] = true
      }
      return showerrs
    })

    // bail out if this version has already been validated
    if (formversion === validatedversion) return

    // use formversion to make sure we never use the errors object from an outdated validation
    // just wait for the final validation to finish
    const saveversion = formversion
    // if we expect more changes, e.g. the user is currently typing, delay validation
    // for half a second to reduce traffic to the server
    if (delayvalidation) await _.sleep(debouncetimer)
    if (formversion === saveversion) {
      try {
        validatedversion = formversion
        const newerrors = await validate(currentformdata, name, currenterrors)
        if (formversion === saveversion) {
          // when timeout expires, benefit of the doubt is over, show them their error
          showerrors.update(showerrs => ({ ...showerrs, [name]: true }))
          errors.set(newerrors || {})
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const setvalue = name => async (value, delayvalidation = false) => {
    // update the formdata with the new value
    formdata.update(fd => {
      return _set(fd, name, value)
    })
    await validatechange(name, delayvalidation)
  }

  // when an input loses focus, it should show errors immediately
  const blur = name => async () => {
    await validatechange(name, false)
  }

  // register inputs in order, so that we can always show errors above
  // where the user is working
  // TODO: make this function a little bit smarter when adding new inputs dynamically
  // e.g. with an "add more" button
  const register = name => {
    registeredInputs.push(name)
  }
  const deregister = name => () => {
    registeredInputs = registeredInputs.filter(n => n !== name)
  }

  setContext(SMARTFORM, {
    // this is the standard function an input will call to connect to the form
    // they provide a name, and they get back a personalized set of derived svelte stores
    // along with the blur and setvalue functions
    subscribe: name => {
      // automatically register new subscribers
      register(name)
      return {
        value: aggressivederived(formdata, $formdata => {
          return _get($formdata, name)
        }),
        errors: aggressivederived(errors, $errors => {
          return _get($errors, name) || []
        }),
        showvalidation: aggressivederived(showerrors, $showerrors => {
          return $showerrors[name]
        }),
        blur: blur(name),
        setvalue: setvalue(name),
        unsubscribe: deregister(name)
      }
    }
  })

  // onsubmit locks while in flight
  let submitlocked = false
  async function onsubmit () {
    if (submitlocked) return
    submitlocked = true
    try {
      const newerrors = await submit(currentformdata)
      submiterror = undefined
      // all inputs should show errors
      showerrors.set(registeredInputs.reduce((showerrs, registeredname) => {
        showerrs[registeredname] = true
        return showerrs
      }, {}))
      errors.set(newerrors || {})
    } catch (e) {
      submiterror = errormessage
      console.error(e.message)
    } finally {
      submitlocked = false
    }
  }
</script>

<form class={className} on:submit|preventDefault={onsubmit}>
  {#if submiterror}<div class="danger">{submiterror}</div>{/if}
  <slot submitting={submitlocked}></slot>
</form>
