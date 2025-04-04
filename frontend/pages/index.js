import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/products`);
                console.log('Products response:', response.data);
                setProducts(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Fashion Marketplace</h1>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Fashion Marketplace</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                    <p className="text-sm mt-2">Please make sure the backend server is running</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Fashion Marketplace</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <p className="text-2xl font-bold text-green-600">${product.price}</p>
                            <button 
                                onClick={() => handleCheckout(product)}
                                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function handleCheckout(product) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.post(`${apiUrl}/checkout`, { 
            items: [product] 
        });
        window.location.href = response.data.url;
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error processing checkout. Please try again.');
    }
} 