<style>
  .backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 2;
  }
  .lds-dual-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: inline-block;
    width: 11%;
    padding-top: 11%;
  }
  .lds-dual-ring:after {
    position: absolute;
    top: 0;
    left: 0;
    content: " ";
    display: block;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 4px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
<div class="backdrop">
  <div class="lds-dual-ring"></div>
</div>
