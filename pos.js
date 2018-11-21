'use strict';

function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: 'Coca-Cola',
            unit: 'bottle',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: 'Apple',
            unit: 'kg',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: 'Litchi',
            unit: 'kg',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: 'Battery',
            unit: '',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: 'Instant noodle',
            unit: 'pack',
            price: 4.50
        }
    ];
}

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}

function getItemDetail(barcode, inventory) {
    let barcodeQuantity = barcode.split('-');
    let quantity = 1;
    barcode = barcodeQuantity[0];
    if (barcodeQuantity.length > 1) {
        quantity = parseInt(barcodeQuantity[1]);
    }
    return {itemDetail: inventory.find(invItem => invItem.barcode == barcode), quantity: quantity};
}

function getDetailItemList(inventory, itemList, detailItemList) {
    itemList.forEach(barcode => {
        let index = detailItemList.findIndex(detailItem => detailItem["barcode"] == barcode);
        if (index < 0) {
            // create new detailItemList item
            let newItemQuantity = getItemDetail(barcode, inventory);
            let newItem = newItemQuantity["itemDetail"];
            newItem["quantity"] = newItemQuantity["quantity"];
            if (newItem["subtotal"] == null) {
                newItem["subtotal"] = newItem["price"] * newItem["quantity"];
            } else {
                newItem["subtotal"] += newItem["price"] * newItem["quantity"];
            }
            detailItemList.push(newItem);
        } else {
            // add 1 to existing detailItemList item quantity
            detailItemList[index]["quantity"]++;
            detailItemList[index]["subtotal"] += detailItemList[index]["price"];
        }
    });
    return detailItemList;
}

function getDiscountList(promotion, barcodes, detailItemList) {
    // Buy two get one free promotion
    if (promotion == "BUY_TWO_GET_ONE_FREE") {
        return detailItemList.filter(detailItem => barcodes.includes(detailItem.barcode)).map(discountItem => {
            let quantity = discountItem["quantity"];
            discountItem["subtotal"] = discountItem["price"] * (quantity - Math.floor(quantity/3));
            return discountItem;
        });
    }
}

function calculateDiscount(detailItemList, discountList) {
    let saving = 0;
    return detailItemList.map(detailItem => {
        let discountItem = discountList.find(discountItem => discountItem["barcode"] == detailItem["barcode"]);
        if (discountItem != null) {
            saving += detailItem["price"] - discountItem["price"];
            return discountItem;
        }
        return detailItem;
    });
}

function printReceipt() {

}

module.exports = {
    getItemDetail,
    getDetailItemList,
    getDiscountList,
    calculateDiscount,
    printReceipt
};