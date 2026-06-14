import { Favorite } from "../models/Favorite";
import { Product } from "../models/Product";

export const FavoriteService = {
    getFavoritesByUserId: async (userId: string) => {
        const favorites = await Favorite.find({ userId }).lean();
        const productIds = favorites.map((fav) => fav.productId);

        if (productIds.length === 0) return [];

        const products = await Product.find({ _id: { $in: productIds } }).lean();
        const productosPorId = new Map(
            products.map((p) => [p._id.toString(), p])
        );

        return favorites
            .map((fav) => ({
                ...fav,
                productId: productosPorId.get(fav.productId) ?? null,
            }))
            .filter((fav) => fav.productId !== null);
    },
    toggleFavorite: async (userId: string, productId: string) => {
        const exist = await Favorite.findOne({ userId, productId})
        if (!exist) {
            const newFavorite = await Favorite.create({ userId, productId })
            return { action: "added", favorite: newFavorite };
        } else {
            await Favorite.findByIdAndDelete(exist._id)
            return { action: "removed"}
        }
    },
    removeFavorite: async (favId: string) => {
        return Favorite.findByIdAndDelete(favId);
    }
}
