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

function countByBarcode(barcodes) {
    let barcodeCount = {};
    barcodes.map(barcode => {
        const barcodeCode = barcode.split('-')[0];
        let barcodeQuantity = 1;
        if (barcode.split('-').length > 1) {
            barcodeQuantity = parseFloat(barcode.split('-')[1]);
        }
        if (barcodeCount[barcodeCode] == null) {
            barcodeCount[barcodeCode] = barcodeQuantity;
        } else {
            barcodeCount[barcodeCode] += barcodeQuantity;
        }
    });
    return barcodeCount;
}

function getItemDetail(barcode, inventory) {
    let barcodeQuantity = barcode.split('-');
    let quantity = 1;
    barcode = barcodeQuantity[0];
    if (barcodeQuantity.length > 1) {
        quantity = parseFloat(barcodeQuantity[1]);
    }
    return {itemDetail: inventory.find(invItem => invItem.barcode == barcode), quantity: quantity};
}

function getDetailItemList(inventory, itemList) {
    let detailItemList = new Array();
    itemList.forEach(barcode => {
        // create new detailItemList item
        let {"itemDetail": itemObject, "quantity": itemQuantity} = getItemDetail(barcode, inventory);
        let newItem = Object.assign({}, itemObject, {"quantity": itemQuantity});
        // let newItemQuantity = getItemDetail(barcode, inventory);
        // let newItem = newItemQuantity["itemDetail"];
        // newItem["quantity"] = newItemQuantity["quantity"];

        const index = detailItemList.findIndex(detailItem => detailItem["barcode"] == newItem["barcode"]);
        // console.log(index);
        if (index < 0) {
            newItem["subtotal"] = newItem["price"] * newItem["quantity"];
            detailItemList.push(newItem);
        } else {
            // add quantity to existing detailItemList item quantity
            let newItem2 = detailItemList[index];
            newItem2["quantity"] += newItem["quantity"];
            newItem2["subtotal"] = newItem2["quantity"] * newItem2["price"];
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
    return detailItemList.map(detailItem => {
        let discountItem = discountList.find(discountItem => discountItem["barcode"] == detailItem["barcode"]);
        if (discountItem != null) {
            return discountItem;
        }
        return detailItem;
    });
}

function generateReceipt(discountedDetailItemList) {
    let receipt = "***<store earning no money>Receipt ***\n";
    let total = 0;
    let saving = 0;

    discountedDetailItemList.forEach(discountedItem => {
        total += discountedItem["subtotal"];
        saving += discountedItem["price"] * discountedItem["quantity"] - discountedItem["subtotal"];
        receipt = receipt + 
            "Name: " + discountedItem["name"] + ", " +
            "Quantity: " + discountedItem["quantity"] + " " +
            discountedItem["unit"];
        receipt = discountedItem["quantity"] > 1 && discountedItem["unit"] != '' ? receipt + "s, " : receipt + ", ";
        receipt = receipt +
            "Unit price: " + discountedItem["price"].toFixed(2) + " (yuan), " +
            "Subtotal: " + discountedItem["subtotal"].toFixed(2) + " (yuan)\n";
    });
    receipt = receipt +
        "----------------------\n" + 
        "Total: " + total.toFixed(2) + " (yuan)\n" +
        "Saving: " + saving.toFixed(2) + " (yuan)\n" +
        "**********************";
    return receipt;
}

function printReceipt(itemList) {
    let inventory = loadAllItems();
    let promoteList = loadPromotions();
    let detailItemList = getDetailItemList(inventory, itemList);
    let discountList;
    promoteList.forEach(promotion => {
        discountList = getDiscountList(promotion["type"], promotion["barcodes"], detailItemList);
    });
    let discountedDetailItemList = calculateDiscount(detailItemList, discountList);
    console.log(generateReceipt(discountedDetailItemList));
    return generateReceipt(discountedDetailItemList);
}

module.exports = {
    countByBarcode,
    getItemDetail,
    getDetailItemList,
    getDiscountList,
    calculateDiscount,
    generateReceipt,
    printReceipt
};