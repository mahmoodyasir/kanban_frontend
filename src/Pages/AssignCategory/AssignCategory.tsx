import { useEffect, useRef, useState } from "react";
import { getAllProduct, updateProductCategory } from "../../ApiGateways/product";
import type { TProduct } from "../../Utils/utils";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Chip, Dialog, DialogContent, DialogTitle, Divider, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

const AssignCategory = () => {
    const location = useLocation();
    const hasReloaded = useRef(false);
    const [uncategorized, setUncategorized] = useState<TProduct[]>([]);
    const [categorized, setCategorized] = useState<Record<string, TProduct[]>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<TProduct | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reset, setReset] = useState(false);
    const [selectOrText, setSelectOrText] = useState(true);
    const NEW_CATEGORY_PLACEHOLDER = "NewCategoryPlaceholder";

    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('assign-category-reloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('assign-category-reloaded', 'true');
            window.location.reload();
        }


        return () => {
            sessionStorage.removeItem('assign-category-reloaded');
        };
    }, []);

    useEffect(() => {
        getAllProduct(1, 100, "", "", true,
            (data) => {
                const products: TProduct[] = data?.data;
                const uncategorized: TProduct[] = products.filter(p => p.category === 'uncategorized');
                const grouped: Record<string, TProduct[]> = {};
                products.forEach(p => {
                    if (p.category !== 'uncategorized') {
                        if (!grouped[p.category]) grouped[p.category] = [];
                        grouped[p.category].push(p);
                    }
                });
                setUncategorized(uncategorized);
                setCategorized(grouped);
                setCategories(Object.keys(grouped));
            },
            (res) => console.log(res)
        )
    }, [reset]);

    const onDragEnd = (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const productFromUncategorized = uncategorized.find(p => p._id === draggableId);
        const productFromCategorized = Object.values(categorized).flat().find(p => p._id === draggableId);
        const product = productFromUncategorized || productFromCategorized;

        if (!product) return;

        if (destination.droppableId === NEW_CATEGORY_PLACEHOLDER) {
            setSelectedProduct(product);
            setIsModalOpen(true);
            return;
        }

        if (source.droppableId === "uncategorized" && destination.droppableId !== "uncategorized") {
            setSelectedProduct(product);
            setIsModalOpen(true);
        } else if (source.droppableId !== destination.droppableId) {
            updateProductCategory(product._id, { category: destination.droppableId },
                () => setReset(prev => !prev),
                err => console.error(err)
            );
        }
    }

    const handleCategoryAssign = () => {
        if (!selectedProduct || !selectedCategory) return;

        const body = { category: selectedCategory };
        updateProductCategory(String(selectedProduct._id), body,
            () => {
                setIsModalOpen(false);
                setSelectedCategory('');
                setSelectedProduct(undefined);
                setSelectOrText(true);
                setReset(prev => !prev);
            },
            err => console.log(err)
        );
    }

    return (
        <div className="p-4 space-y-10">
            <h2 className="text-xl font-bold">🧾 Uncategorized Products</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="uncategorized">
                    {(provided: any) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="bg-white p-4 border rounded-md shadow-sm"
                        >
                            {uncategorized.map((product, index) => (
                                <Draggable
                                    key={product._id}
                                    draggableId={product._id}
                                    index={index}
                                >
                                    {(provided: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="p-2 border mb-2 w-fit cursor-pointer"
                                        >
                                            {product.description}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <h2 className="text-xl font-bold mt-10">🗂 Categorized Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[NEW_CATEGORY_PLACEHOLDER, ...categories].map((category: string) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided: any) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-3 rounded shadow min-h-[50px]"
                                >
                                    <h4 className="font-semibold mb-2">{category}</h4>
                                    {(categorized[category] || []).map((product: TProduct, index: number) => (
                                        <Draggable
                                            key={product._id}
                                            draggableId={product._id}
                                            index={index}
                                        >
                                            {(provided: any) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="text-sm p-1 border mb-2 w-fit"
                                                >
                                                    {product.description}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center w-full">
                <DialogTitle className="font-bold text-lg mb-2">{selectOrText ? 'Select Category To Assign' : 'Write Category'}</DialogTitle>
                <DialogContent className="bg-white p-6 rounded shadow-lg w-[300px]">
                    {
                        selectOrText ?
                            <>
                                <Button onClick={() => setSelectOrText(false)} className="bg-green-600 text-white w-full mb-4">Insert New Category</Button>
                                <Divider>
                                    <Chip label="OR" size="small" />
                                </Divider>
                                <select
                                    className="w-full border p-2 rounded mt-4"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">-- Choose Category --</option>
                                    {categories.map((c: string) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <Button
                                    className="mt-4 w-full bg-blue-600 text-white p-2 rounded"
                                    onClick={handleCategoryAssign}
                                >
                                    Move Product
                                </Button>
                            </>
                            :
                            <>
                                <TextField
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    label="Category"
                                    className="w-full mt-4"
                                />
                                <div className="flex flex-col justify-center justify-items-center items-center gap-2">
                                    <Button
                                        className="mt-4 w-full bg-blue-600 text-white p-2 rounded"
                                        onClick={handleCategoryAssign}
                                    >
                                        Move Product
                                    </Button>
                                    <Button onClick={() => setSelectOrText(true)} className="bg-red-600 text-white w-full mb-4">Cancel</Button>
                                </div>
                            </>
                    }
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AssignCategory;
