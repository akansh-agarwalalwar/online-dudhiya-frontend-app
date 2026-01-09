// Helper functions for Buy Again with Size Selection

export const handleSizeSelection = async (item, remainingItems, successCount, failedItems, setSizePickerData, setShowSizePicker, medicineService, processNextItem) => {
    try {
        // Fetch product details to get available sizes
        const response = await medicineService.getProductById(item.medicineId);
        const productData = response.data;

        if (productData?.sizes && productData.sizes.length > 0) {
            setSizePickerData({
                item,
                productName: item.medicineName,
                sizes: productData.sizes,
                remainingItems,
                successCount,
                failedItems
            });
            setShowSizePicker(true);
        } else {
            // No sizes available, add to failed items
            failedItems.push(`${item.medicineName} (no sizes available)`);
            await processNextItem(remainingItems.slice(1), successCount, failedItems);
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        failedItems.push(`${item.medicineName} (failed to load sizes)`);
        await processNextItem(remainingItems.slice(1), successCount, failedItems);
    }
};

export const handleSizeSelected = async (selectedSize, sizePickerData, setShowSizePicker, dispatch, addToCart, processNextItem) => {
    setShowSizePicker(false);

    if (!sizePickerData) return;

    const { item, remainingItems, successCount, failedItems } = sizePickerData;

    try {
        const payload = {
            medicineId: item.medicineId,
            quantity: item.quantity,
            sizeId: selectedSize.id,
            product: {
                id: item.medicineId,
                productName: item.medicineName,
                sale_price: selectedSize.salePrice,
                images: item.images || [],
                sizes: [{
                    id: selectedSize.id,
                    sizeName: selectedSize.sizeName,
                    salePrice: selectedSize.salePrice
                }]
            }
        };

        await dispatch(addToCart(payload)).unwrap();
        await processNextItem(remainingItems.slice(1), successCount + 1, failedItems);
    } catch (error) {
        console.error('Error adding item with size:', error);
        failedItems.push(`${item.medicineName} (failed to add)`);
        await processNextItem(remainingItems.slice(1), successCount, failedItems);
    }
};

export const processNextItem = async (remainingItems, successCount, failedItems, handleSizeSelection) => {
    if (remainingItems.length > 0) {
        await handleSizeSelection(remainingItems[0], remainingItems, successCount, failedItems);
    } else {
        showBuyAgainResults(successCount, failedItems);
    }
};

export const showBuyAgainResults = (successCount, failedItems, navigation, setShowSheet) => {
    if (successCount === 0 && failedItems.length > 0) {
        Alert.alert(
            'Unable to Add Items',
            `Could not add items to cart:\n\n${failedItems.join('\n')}\n\nPlease add these items manually from the product page.`
        );
    } else if (failedItems.length > 0) {
        Alert.alert(
            'Partial Success',
            `Added ${successCount} items. Could not add: ${failedItems.join(', ')}.`,
            [
                {
                    text: 'OK',
                    style: 'cancel'
                },
                {
                    text: 'Go to Cart',
                    onPress: () => {
                        setShowSheet(false);
                        navigation.navigate('Cart');
                    }
                }
            ]
        );
    } else {
        Alert.alert(
            'Success',
            'All items have been added to your cart!',
            [
                {
                    text: 'Continue Shopping',
                    style: 'cancel'
                },
                {
                    text: 'Go to Cart',
                    onPress: () => {
                        setShowSheet(false);
                        navigation.navigate('Cart');
                    }
                }
            ]
        );
    }
};
