import axios from 'axios';
import { Button } from 'antd';

function App() {
  // make a request to api
  axios.get('/api/test').then((res) => {
    console.log(res);
  });

  return <Button type="primary">Test</Button>;
}

export default App;
