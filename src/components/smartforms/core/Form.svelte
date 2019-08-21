<script context="module">
  export const SMARTFORM = {}
</script>
<script>
  export let preload
  export let validate
  export let submit
  import { writable, derived } from 'svelte/store'
  import { setContext } from 'svelte'
  import _get from 'lodash/get'
  import _set from 'lodash/set'
  import _ from 'txstate-node-utils/lib/util'

  let currentformdata = JSON.parse(JSON.stringify(preload))
  const formdata = writable(currentformdata)
  formdata.subscribe(fd => { currentformdata = fd })
  const showerrors = writable({})
  const errors = writable({})
  let validationversion = 0
  const registeredInputs = []

  const setvalue = name => async (value, delayvalidation = false) => {
    /*** figure out which inputs should be showing errors ***/
    showerrors.update(showerrs => {
      // give the user a brief period of benefit of the doubt before we show them their error
      showerrs[name] = false
      // show errors for any inputs that are above this one in the page
      for (const registeredname of registeredInputs) {
        if (registeredname === name) break
        showerrs[registeredname] = true
      }
      return showerrs
    })

    // update the formdata with the new value
    formdata.update(fd => {
      return _set(fd, name, value)
    })

    // use validationversion to make sure we never use the errors object from an outdated validation
    // just wait for the final validation to finish
    validationversion++
    const saveversion = validationversion
    // if we expect more changes, e.g. the user is currently typing, delay validation
    // for half a second to reduce traffic to the server
    if (delayvalidation) await _.sleep(500)
    if (validationversion === saveversion) {
      const newerrors = await validate(currentformdata)
      if (validationversion === saveversion) {
        // when timeout expires, benefit of the doubt is over, show them their error
        showerrors.update(showerrs => ({ ...showerrs, [name]: true }))
        errors.set(newerrors)
      }
    }
  }

  // when an input loses focus, it should show errors immediately
  const blur = name => () => {
    showerrors.update(showerrs => {
      for (const registeredname of registeredInputs) {
        showerrs[registeredname] = true
        if (registeredname === name) break
      }
      return showerrs
    })
  }

  const register = name => {
    registeredInputs.push(name)
  }

  setContext(SMARTFORM, {
    subscribeValue: name => {
      return derived(formdata, $formdata => {
        return _get($formdata, name)
      })
    },
    subscribeErrors: name => {
      return derived(errors, $errors => {
        return _get($errors, name) || []
      })
    },
    subscribeShowErrors: name => {
      return derived(showerrors, $showerrors => {
        return $showerrors[name]
      })
    },
    blur,
    setvalue,
    register
  })
</script>

<form>
  <slot></slot>
</form>
