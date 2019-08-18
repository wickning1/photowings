<script>
  import { detailimage, cancelDetailView } from '../stores/gallery'
  import Modal from './Modal'
  import Viewer from './gallery/Viewer'

  $: modalactive = $detailimage && true
</script>

<slot modalactive={modalactive}></slot>
{#if modalactive}
  <Modal on:dismiss={cancelDetailView}>
    {#if $detailimage}
      <Viewer image={$detailimage} on:dismiss={cancelDetailView}/>
    {/if}
  </Modal>
{/if}
