import React from 'react';
import GlobalRouter from "./router";
import {CssBaseline} from "@material-ui/core";


const App = (props) => {
  return (
      <>
          <CssBaseline/>
          <GlobalRouter/>
      </>
  );
};

export default App;
