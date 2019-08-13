<script>
  import IconButton from '../IconButton'
  import { selectednumber } from '../../stores/selectedimages'
  const edit = e => {
    console.log(e)
  }
  const keydown = e => {
    if ($selectednumber && (e.key === 'e' || e.keyCode === 69)) {
      edit(e)
    }
  }
</script>

<style>
  .bulk-actions {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 8px;
    margin-bottom: 8px;
  }
</style>

<svelte:window on:keydown={keydown} />
{#if $selectednumber}
  <div class="bulk-actions primary">
    <div class="bulk-description" aria-live="assertive">{$selectednumber} image{$selectednumber === 1 ? '' : 's'} selected <span class="sr-only">press e to begin editing</span></div>
    <div class="bulk-buttons">
      <IconButton name="create" label="edit all selected images" relative on:click={edit}/>
    </div>
  </div>
{/if}
