import ProductList from "../components/ProductList"

const Home = () => {
    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Katalog Produk</h1>
            <ProductList />
        </div>
    )
}

export default Home