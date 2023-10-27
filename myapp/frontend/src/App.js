import './App.css';
import Comds from './components/testcom';
import BasicExample from './components/accord'
import ButtonsExample from './components/buttonexample'
import SelectBasicExample from './components/form'
import VariationsExample from './components/variationexample'
import CreatePM from './components/CreatePM'
// import background from "./images/jojo.jpg";

function App() {
  return (
    // <div style={{ backgroundImage: `url(${background})` }}>
    <main className="content">
      <h1 className="text-success text-uppercase text-center my-4">
        Iot Management System
      </h1>
      <div>
        <VariationsExample />
      </div>
      <div>
        <CreatePM />
      </div>
      

      {/* <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={this.createItem} className="btn btn-info">
                Add task
              </button>
            </div>
            {this.renderTabList()}
            <ul className="list-group list-group-flush">
              {this.renderItems()}
            </ul>
          </div>
        </div>
      </div> */}
    </main>
// </div>
  );
}

export default App;
