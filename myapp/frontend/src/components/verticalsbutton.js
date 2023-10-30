import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Link, Route, Routes} from 'react-router-dom';

function VerticalExample() {
  return (
    <ButtonGroup vertical>
        <Link to="/create">
         <Button>Create Page</Button>
        </Link>
        <Link to="/monitor">
         <Button>Monitor</Button>
        </Link>
      {/* <Button>Button</Button>

      <Button>Button</Button>
      <Button>Button</Button> */}
    </ButtonGroup>
  );
}

export default VerticalExample;