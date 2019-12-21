<style>
  .page-header {
    position: relative;
    overflow: visible;
    background-color: var(--accent-bg);
    color: var(--accent-text);
    padding: 10px 26px;
  }
  .page-header h1 {
    font-size: 24px;
    margin: 0;
    padding: 0;
  }
  .page-header :global(form) {
    top: 50px;
  }
  .page-header :global(.icon-button) {
    right: 16px;
  }
</style>

<header class="page-header">
	<h1><slot /></h1>
	<slot name="extra"/>
</header>
