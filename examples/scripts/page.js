/*global Atomic:true, console:true */

// page.js file

// Button with Debug Tracer wiring
Atomic.load('components/button', 'wirings/debugtracer')
.then(Atomic.expand(function(Button, debugtracer) {
  // build the button and add echo wiring
  var button = new Button(document.getElementById('my-button'));
  button.wireIn(debugtracer());

  button.load()
  .then(function() {
    console.log('The Button with Debug Tracer wiring has loaded');
  }, Atomic.thrower);
}), Atomic.thrower);

// Carousel with Buttons
Atomic.load('components/button', 'components/carousel')
.then(Atomic.expand(function(Button, Carousel) {
  var next = new Button(document.getElementById('carousel-next'));
  var prev = new Button(document.getElementById('carousel-prev'));
  var carousel = new Carousel(document.getElementById('carousel'));

  carousel.load()
  .then(next.load())
  .then(prev.load())
  .then(function() {
    carousel.bind(next, next.events.USE, 'next');
    carousel.bind(prev, prev.events.USE, 'previous');
    console.log('The Carousel with Buttons has been loaded');
  }, Atomic.thrower);
}), Atomic.thrower);

// Carousel with Buttons that Wraps
Atomic.load('components/button', 'components/carousel')
.then(Atomic.expand(function(Button, Carousel) {
  var next = new Button(document.getElementById('carousel-wraps-next'));
  var prev = new Button(document.getElementById('carousel-wraps-prev'));
  var carousel = new Carousel(document.getElementById('carousel-wraps'));

  // example of an inline wiring to add wrapping functionality
  carousel.wireIn(function(needs, nodes) {
    carousel.wrap('go', function(go, to) {
      if (to < 0) {
        to = this.size() - 1;
      }
      else if(to > this.size() - 1) {
        to = 0;
      }
      return go(to);
    });
  });

  carousel.load()
  .then(next.load())
  .then(prev.load())
  .then(function() {
    carousel.bind(next, next.events.USE, 'next');
    carousel.bind(prev, prev.events.USE, 'previous');
    console.log('The Carousel with Buttons (Wrapping) has been loaded');
  }, Atomic.thrower);
}), Atomic.thrower);


// Carousel with Buttons and Fetch
Atomic.load('components/button', 'components/carousel', 'wirings/fetch')
.then(Atomic.expand(function(Button, Carousel, fetch) {
  var next = new Button(document.getElementById('carousel-fetch-next'));
  var prev = new Button(document.getElementById('carousel-fetch-prev'));
  var carousel = new Carousel(document.getElementById('carousel-fetch'));

  // TODO: Should wirings be capitalized? Eric
  // TODO: should we define a standard naming practice to help diffferentiate
  //   Components vs wirings?  maybe wirings could start with an underscore? Eric

  carousel.wireIn(fetch({
    endpoint: 'data.html'
  }));

  carousel.load()
  .then(next.load())
  .then(prev.load())
  .then(function() {
    carousel.bind(next, next.events.USE, 'next');
    carousel.bind(prev, prev.events.USE, 'previous');
    console.log('The Carousel with Buttons with fetching has been loaded');

    // The fetch wiring fetches content and then inserts the result
    // into the Items list
    carousel.fetch({
      offset: 4,
      count: 10
    });

    // do it again for fun
    carousel.fetch({
      offset: 4,
      count: 10
    });

  }, Atomic.thrower);
}), Atomic.thrower);