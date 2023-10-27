import Form from 'react-bootstrap/Form';

function SelectBasicExample() {
  return (
    <Form.Select aria-label="Default select example">
      <option>Open this select menu</option>
      <option value="1">Click this if you are gay</option>
      <option value="2">I need some more ideas</option>
      <option value="3">Have a dick but still like dicks</option>
    </Form.Select>
  );
}

export default SelectBasicExample;