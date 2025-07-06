import { useEffect, useState } from "react";
import { getAllProduct } from "../../ApiGateways/product";
import type { TProduct } from "../../Utils/utils";

const KanbanDashboard = () => {
    const [uncategorized, setUncategorized] = useState<TProduct[]>([]);
    const [categorized, setCategorized] = useState<Record<string, TProduct[]>>({});
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        getAllProduct(1, 100, "", "", true,
            (data) => {
                const products: TProduct[] = data?.data;
                const uncategorized = products.filter(p => p.category === 'Uncategorized');
                const grouped: Record<string, TProduct[]> = {};
                products.forEach(p => {
                    if (p.category !== 'Uncategorized') {
                        if (!grouped[p.category]) grouped[p.category] = [];
                        grouped[p.category].push(p);
                    }
                });
                setUncategorized(uncategorized);
                setCategorized(grouped);
                setCategories(Object.keys(grouped));
            },
            err => console.error(err)
        );
    }, []);

    const recentProducts = [...uncategorized, ...Object.values(categorized).flat()]
        .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const getCategoryStats = () => {
        return categories.map(cat => ({
            name: cat,
            count: categorized[cat]?.length || 0
        })).sort((a, b) => b.count - a.count);
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="bg-blue-50 p-4 rounded shadow max-h-[300px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">📁 Products Per Category</h3>
                    <div className="space-y-3">
                        {getCategoryStats().map(stat => (
                            <div
                                key={stat.name}
                                className="flex justify-between items-center bg-white p-2 rounded shadow-sm mb-2"
                            >
                                <span className="font-medium">{stat.name}</span>
                                <span className="text-blue-700 font-bold">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="bg-green-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">📦 Total Products</h3>
                    <p className="text-2xl font-bold text-green-800">
                        {uncategorized.length + Object.values(categorized).flat().length}
                    </p>
                </div>
            </div>


            <div className="mt-8">
                <h3 className="text-lg font-bold mb-2">🆕 Recently Added Products</h3>
                <ul className="space-y-2">
                    {recentProducts.map(p => (
                        <li key={p._id} className="border p-2 rounded bg-gray-50 mb-2">
                            <p className="font-medium">{p.description}</p>
                            <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default KanbanDashboard;
