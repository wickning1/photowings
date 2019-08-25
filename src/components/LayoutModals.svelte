<script>
  import { detailimage, cancelDetailView, editing, cancelEditing } from '../stores/gallery'
  import Modal from './Modal'
  import Viewer from './gallery/Viewer'
  import Editor from './editablegallery/Editor'

  $: modalactive = ($detailimage || $editing) && true
  $: lockbackdrop = $editing && true
  function cancelAnything () {
    if ($detailimage) cancelDetailView()
    else if ($editing) cancelEditing()
  }
</script>

<slot modalactive={modalactive}></slot>
{#if modalactive}
  <Modal on:dismiss={cancelAnything} lockbackdrop={lockbackdrop}>
    {#if $detailimage}
      <Viewer image={$detailimage} on:dismiss={cancelAnything} />
    {:else if $editing}
      <Editor on:dismiss={cancelAnything} />
    {/if}
  </Modal>
{/if}
