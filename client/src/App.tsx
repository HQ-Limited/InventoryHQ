import axios from 'axios';
import { Button } from 'antd';

function App() {
  axios.get('/api/test').then((res) => {
    console.log(res);
  });

  return <Button type="primary">Test</Button>;
}

export default App;
