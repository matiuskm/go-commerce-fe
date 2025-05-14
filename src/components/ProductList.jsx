import { useEffect, useState } from "react";

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8080/products")
        .then(res => res.json())
        .then(data => {
            setProducts(data.products || [])
            setLoading(false)
        })
        .catch(err => {
            console.log("Failed to fetch product:", err)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {products.map(product => (
                <div key={product.ID} className="border p-3 rounded shadow">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="font-bold text-green-600">Rp {product.price}</p>
                </div>
            ))}
        </div>
    )
}

export default ProductList