import React from "react";
import LayoutWrapper from "./components/LayoutWrapper";


const App = () => {
    const params = window.location.href.split('/');

    console.log(params[3]);
    
    return <LayoutWrapper defaults={params[3] ? params[3] : null} />
} ;

export default App;