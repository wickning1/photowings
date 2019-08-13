<script>
  import { which, data } from '../stores/modal'
  import Modal from './Modal'
  import Viewer from './gallery/Viewer'

  const dismiss = () => {
    which.update(w => '')
    data.update(d => {})
  }
</script>

<slot modalactive={$which && true}></slot>
{#if $which}
  <Modal on:dismiss={dismiss}>
    {#if $which === 'imageviewer'}
      <Viewer image={$data} on:dismiss={dismiss}/>
    {/if}
  </Modal>
{/if}
