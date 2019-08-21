<script>
  import { detailimage, cancelDetailView, editing, cancelEditing } from '../stores/gallery'
  import Modal from './Modal'
  import Viewer from './gallery/Viewer'
  import Editor from './gallery/Editor'

  $: modalactive = ($detailimage || $editing) && true
  function cancelAnything () {
    if ($detailimage) cancelDetailView()
    else if ($editing) cancelEditing()
  }
</script>

<slot modalactive={modalactive}></slot>
{#if modalactive}
  <Modal on:dismiss={cancelAnything}>
    {#if $detailimage}
      <Viewer image={$detailimage} on:dismiss />
    {:else if $editing}
      <Editor on:dismiss />
    {/if}
  </Modal>
{/if}
