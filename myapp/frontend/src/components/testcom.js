import React from 'react';
import Button from 'react-bootstrap/Button';

function Comds() {
  return (
    <div class="container">
  <h2>Button Sizes</h2>
  <button type="button" class="btn btn-primary btn-lg">Large</button>
  <button type="button" class="btn btn-primary">Normal</button>    
  <button type="button" class="btn btn-primary btn-sm">Small</button>
  <button type="button" class="btn btn-primary btn-xs">XSmall</button>
</div>
  );
}

export default Comds;
