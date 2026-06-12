import { Favorite } from "../models/Favorite";

export const FavoriteService = {

    getFavoritesByUserId: async (userId: string) => {
        const getFavoritesByUserId = await Favorite.find({ userId: userId}).populate("productId"); 
        return getFavoritesByUserId;
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
    }
}