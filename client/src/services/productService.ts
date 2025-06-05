import axios from 'axios';

const API_URL = 'https://localhost:44301/api/Product/simple';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class ProductService {
    async getProducts(body: any) {
        return await axios.post(API_URL, body);
    }
}

export default new ProductService();
