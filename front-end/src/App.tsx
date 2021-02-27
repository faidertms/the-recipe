import HomePage from "./pages/Home";

/**
 *  due to having only one page will not be used React Router
 */
function App(): JSX.Element {
  return (
    <div className="bg-white">
      <HomePage />
    </div>
  );
}

export default App;
