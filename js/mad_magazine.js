export default class MadMagazine {
  config = {
  	assets: [
  		`./assets/mad/mad--cover.jpg`,
  		`./assets/mad/mad--page_1.jpg`,
  		`./assets/mad/mad--page_2.jpg`,
  		`./assets/mad/mad--page_3.jpg`,
  		`./assets/mad/mad--page_4.jpg`,
  		`./assets/mad/mad--page_5.jpg`
  	],
  	scrollCount: 0
  };

  init () {
    const _this = this;
  	setTimeout(function () {
  		_this.PRELOAD_ASSETS();
      console.log('running mad_magazine.js');
  	}, 250);
  };

  loadMadWidget () {
  	const page = document.querySelectorAll('.mad_magazine.mag-page');
  	const cont = document.querySelector('.mad_magazine.container');
  	let zIndex = 15;
  	for (let i = 0; i < this.config.assets.length; i++) {
  		page[i].style.backgroundImage = `url(${this.config.assets[i]})`;
  		page[i].style.zIndex = `${zIndex}`;
  		zIndex--;
  	}
  	cont.style.height = `${page[0].getBoundingClientRect().width * this.config.assets.length}px`;
  	this.setEventListeners();
  };

  setEventListeners () {
  	window.addEventListener('scroll',this.scrollListener.bind(this),true);
  };

  scrollListener () {
  	const cont = document.querySelector('.mad_magazine.container');
  	const magPage = document.querySelectorAll('.mad_magazine.mag-page');
    const contRec = cont.getBoundingClientRect();
    const magRec = magPage[this.config.scrollCount].getBoundingClientRect();
    let contRecYForm;
    if (this.config.scrollCount === 0)
      contRecYForm = contRec.y - (contRec.width * (this.config.scrollCount));
    else
      contRecYForm = -Math.abs(Math.abs(contRec.y) - (contRec.width * this.config.scrollCount));
    let transformVal = `translateX(${contRecYForm}px)`;
    magPage[this.config.scrollCount].style.transform = transformVal;
    if (Math.abs(magRec.x) >= Math.abs(magRec.width))
      this.config.scrollCount++;
    console.log('scroll count: ' + this.config.scrollCount);
    console.log('calc value' + contRecYForm);
    console.log('x value' + magRec.x);
  };

  LOAD_ASSET (url,loadDiv,evt) {
    const file = new Image();
    file.src = url;
    file.onload = () => {
      evt.detail.url = url;
      loadDiv.dispatchEvent(evt);
    };
    file.onerror = () => {
      evt.detail.url = url;
      loadDiv.dispatchEvent(evt);
    };
  };

  PRELOAD_ASSETS () {
    const preloadEvent = new CustomEvent('preload_event', {detail: {url: null}});
    const loadDiv = document.createElement('div');
    let numAssets = this.config.assets.length;
    let assetsLoaded = 0;
    for (let asset of this.config.assets)
      this.LOAD_ASSET(asset, loadDiv, preloadEvent);
    loadDiv.addEventListener('preload_event',(e) => {
      ++assetsLoaded;
      console.log(`${assetsLoaded} / ${numAssets}: ${e.detail.url}`);
      if (numAssets == assetsLoaded)
        this.loadMadWidget();
    });
  };
}