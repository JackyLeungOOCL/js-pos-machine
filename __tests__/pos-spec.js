'use strict';
const pos = require('../pos');

describe("shoud map receipt items correctly", function() {
    it("should count single receipt items", function() {
        const barcodes = ["ITEM000000", "ITEM000000", "ITEM000001", "ITEM000001", "ITEM000001"]
        const barcodeCount = pos.countByBarcode(barcodes);
        const expected = 
            {
                "ITEM000000": 2,
                "ITEM000001": 3
            };
        expect(barcodeCount).toEqual(expected);
    });

    fit("should count multiple receipt items", function() {
        const barcodes = ["ITEM000000-3", "ITEM000000", "ITEM000001", "ITEM000001", "ITEM000001"]
        const barcodeCount = pos.countByBarcode(barcodes);
        const expected = 
            {
                "ITEM000000": 4,
                "ITEM000001": 3
            };
        expect(barcodeCount).toEqual(expected);
    });
});

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
        const barcodes = ["ITEM000000-2", "ITEM000000", "ITEM000001", "ITEM000001", "ITEM000001"];
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
    
        // When
        const detailItemList = pos.getDetailItemList(inventory, barcodes);
        const expected = [
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

    it("calculateDiscount should return discounted detailed items correctly", function() {
        // Given
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
        const discountList = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
                unit: 'bottle',
                price: 3.00,
                subtotal: 6.00
            }
        ];

        // When
        const discountedDetailItemList = pos.calculateDiscount(detailItemList, discountList);
        const expected = [
                {
                    barcode: 'ITEM000000',
                    name: 'Coca-Cola',
                    quantity: 3,
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
        expect(discountedDetailItemList).toEqual(expected);
    });
});

describe("should print receipt correctly", function() {
    it("should generate receipt in correct format", function() {
        // Given
        const discountedDetailItemList = [
            {
                barcode: 'ITEM000000',
                name: 'Coca-Cola',
                quantity: 3,
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

        // When
        const receipt = pos.generateReceipt(discountedDetailItemList);
        const expected = 
            "***<store earning no money>Receipt ***\n" +
            "Name: Coca-Cola, Quantity: 3 bottles, Unit price: 3.00 (yuan), Subtotal: 6.00 (yuan)\n" +
            "Name: Sprite, Quantity: 3 bottles, Unit price: 3.00 (yuan), Subtotal: 9.00 (yuan)\n" +
            "----------------------\n" +
            "Total: 15.00 (yuan)\n" +
            "Saving: 3.00 (yuan)\n" +
            "**********************"
        
        // Then
        expect(receipt).toBe(expected);
    });

    it("should print receipt", function() {
        //Given
        const itemList = 
        [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
          ]

        // When
        const receipt = pos.printReceipt(itemList);
        const expected = 
            "***<store earning no money>Receipt ***\n" +
            "Name: Sprite, Quantity: 5 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)\n" +
            "Name: Litchi, Quantity: 2 kgs, Unit price: 15.00 (yuan), Subtotal: 30.00 (yuan)\n" +
            "Name: Instant noodle, Quantity: 3 packs, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)\n" +
            "----------------------\n" +
            "Total: 51.00 (yuan)\n" +
            "Saving: 7.50 (yuan)\n" +
            "**********************"

        // Then
        expect(receipt).toBe(expected);
    });

    it('should print text', () => {

        const tags = [
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000003-2.5',
          'ITEM000005',
          'ITEM000005-2',
        ];
    
        // spyOn(console, 'log');
    
        const receipt = pos.printReceipt(tags);
    
        const expectText = `***<store earning no money>Receipt ***
    Name: Sprite, Quantity: 5 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)
    Name: Litchi, Quantity: 2.5 kg, Unit price: 15.00 (yuan), Subtotal: 37.50 (yuan)
    Name: Instant noodles, Quantity: 3 bags, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)
    ----------------------
    Total: 58.50 (yuan)
    Saving: 7.50 (yuan)
    **********************`;
    
        expect(receipt).toBe(expectText);
      });
});