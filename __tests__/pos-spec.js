'use strict';
const pos = require('../pos');

describe("should get item details correctly", function() {
    it("getItemDetail should return item detail", function() {
        // Given
        const barcode = "ITEM000001";
        const inventory = [
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
            }
        ]
    
        // When
        const itemDetail = pos.getItemDetail(barcode, inventory);
        const expected = 
            {
                itemDetail: 
                    {
                        barcode: 'ITEM000001',
                        name: 'Sprite',
                        unit: 'bottle',
                        price: 3.00
                    },
                quantity: 1
            };
    
        // Then
        expect(itemDetail).toEqual(expected);
    });
    
    it("getItemDetail should return one item detail", function() {
        // Given
        const barcode = "ITEM000001-1";
        const inventory = [
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
            }
        ]
    
        // When
        const itemDetail = pos.getItemDetail(barcode, inventory);
        const expected = 
            {
                itemDetail: 
                    {
                        barcode: 'ITEM000001',
                        name: 'Sprite',
                        unit: 'bottle',
                        price: 3.00
                    },
                quantity: 1
            };
    
        // Then
        expect(itemDetail).toEqual(expected);
    });
    
    it("getItemDetail should return more than one item details", function() {
        // Given
        const barcode = "ITEM000001-3";
        const inventory = [
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
            }
        ]
    
        // When
        const itemDetail = pos.getItemDetail(barcode, inventory);
        const expected = 
            {
                itemDetail: 
                    {
                        barcode: 'ITEM000001',
                        name: 'Sprite',
                        unit: 'bottle',
                        price: 3.00
                    },
                quantity: 3
            };
    
        // Then
        expect(itemDetail).toEqual(expected);
    });
    
    it("getDetailItemList should return detail item list with correct quantity", function() {
        // Given
        const barcodes = ["ITEM000000", "ITEM000000", "ITEM000001", "ITEM000001", "ITEM000001"];
        const inventory = [
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
            }
        ];
        const initList = new Array();
    
        // When
        const detailItemList = pos.getDetailItemList(inventory, barcodes, initList);
        const expected = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 2,
                unit: 'bottle',
                price: 3.00,
                subtotal: 6.00
            },
            {
                barcode: 'ITEM000001',
                name: 'Sprite',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 9.00
            }
        ];
    
        // Then
        expect(detailItemList).toEqual(expected);
    });
});


describe("should calculate discount correctly", function() {
    it("should calculate buy-3-get-1-free for 3 items", function() {
        // Given
        const promotionType = "BUY_TWO_GET_ONE_FREE";
        const promotionBarcodes = ["ITEM000000"];
        const detailItemList = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 9.00
            }
        ];

        // When
        const discountList = pos.getDiscountList(promotionType, promotionBarcodes, detailItemList)
        const expected = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 6.00
            }
        ];

        // Then
        expect(discountList).toEqual(expected);
    });

    it("should calculate buy-3-get-1-free for 7 items", function() {
        // Given
        const promotionType = "BUY_TWO_GET_ONE_FREE";
        const promotionBarcodes = ["ITEM000000"];
        const detailItemList = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 7,
                unit: 'bottle',
                price: 3.00,
                subtotal: 21.00
            }
        ];

        // When
        const discountList = pos.getDiscountList(promotionType, promotionBarcodes, detailItemList)
        const expected = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 7,
                unit: 'bottle',
                price: 3.00,
                subtotal: 15.00
            }
        ];

        // Then
        expect(discountList).toEqual(expected);
    });

    it("should calculate buy-3-get-1-free for specific items", function() {
        // Given
        const promotionType = "BUY_TWO_GET_ONE_FREE";
        const promotionBarcodes = ["ITEM000000", "ITEM000005"];
        const detailItemList = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 9.00
            },
            {
                barcode: 'ITEM000001',
                name: 'Sprite',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 9.00
            }
        ];

        // When
        const discountList = pos.getDiscountList(promotionType, promotionBarcodes, detailItemList)
        const expected = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 6.00
            }
        ];

        // Then
        expect(discountList).toEqual(expected);
    });
});