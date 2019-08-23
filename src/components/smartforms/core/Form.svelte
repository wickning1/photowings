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

  // create a store for the form data, subscribe to it for internal use
  let currentformdata = JSON.parse(JSON.stringify(preload))
  const formdata = writable(currentformdata)
  formdata.subscribe(fd => { currentformdata = fd })

  // create a store for whether each input should be showing its validation status
  const showerrors = writable({})

  // create a store of the error messages for each input, subscribe for use
  let currenterrors = {}
  const errors = writable(currenterrors)
  errors.subscribe(errs => currenterrors = errs)

  // keep a validationversion number to help with async concurrency issues
  let validationversion = 0

  // keep a list of registered inputs, ordered by DOM insertion order, so that
  // we can show errors *above* a specific input
  let registeredInputs = []

  // if an error happens during submit, we need to display it inside the form
  let submiterror

  // blur function needs to know when there is a pending debounce for validation
  let validationpending = false

  async function validatechange (name, delayvalidation) {
    /*** figure out which inputs should be showing errors ***/
    showerrors.update(showerrs => {
      // give the user a brief period of benefit
      // of the doubt until validation finishes
      showerrs[name] = false
      // show errors for any inputs that are above this one in the page
      for (const registeredname of registeredInputs) {
        if (registeredname === name) break
        showerrs[registeredname] = true
      }
      return showerrs
    })

    // use validationversion to make sure we never use the errors object from an outdated validation
    // just wait for the final validation to finish
    validationversion++
    const saveversion = validationversion
    // if we expect more changes, e.g. the user is currently typing, delay validation
    // for half a second to reduce traffic to the server
    validationpending = true
    if (delayvalidation) await _.sleep(debouncetimer)
    if (validationversion === saveversion) {
      validationpending = false
      const newerrors = await validate(currentformdata, name, currenterrors)
      if (validationversion === saveversion) {
        // when timeout expires, benefit of the doubt is over, show them their error
        showerrors.update(showerrs => ({ ...showerrs, [name]: true }))
        errors.set(newerrors || {})
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
    // if we are currently waiting for a validation debounce, speed it up
    // if we have never validated we need to trigger one, in case the field
    // that just lost focus is required
    if (validationpending || validationversion === 0) await validatechange(name, false)
    else {
      // if no need to validate, just show errors for any inputs that are
      // above this one in the page, including this one
      showerrors.update(showerrs => {
        for (const registeredname of registeredInputs) {
          showerrs[registeredname] = true
          if (registeredname === name) break
        }
        return showerrs
      })
    }
  }

  // register inputs in order, so that we can always show errors above
  // where the user is working
  // TODO: make this function a little bit smarter when adding new inputs dynamically
  // e.g. with an "add more" button
  const register = name => {
    registeredInputs.push(name)
  }
  const deregister = name => {
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
        value: derived(formdata, $formdata => {
          return _get($formdata, name)
        }),
        errors: derived(errors, $errors => {
          return _get($errors, name) || []
        }),
        showvalidation: derived(showerrors, $showerrors => {
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
      showerrors.set(registeredInputs.reduce((showerrs, regName) => {
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
