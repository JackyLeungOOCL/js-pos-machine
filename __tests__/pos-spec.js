'use strict';
const pos = require('../pos');

it("getItemDetail should return item detail", function() {
    // Given
    const barcode = "ITEM000001";
    const inventory = [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        }
    ]

    // When
    const itemDetail = pos.getItemDetail(barcode, inventory);
    const expected = 
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        };

    // Then
    expect(itemDetail).toEqual(expected);
});

fit("getDetailItemList should return detail item list with correct quantity", function() {
    // Given
    const barcodes = ["ITEM000000", "ITEM000000", "ITEM000001", "ITEM000001", "ITEM000001"];
    const inventory = [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        }
    ];
    const initList = new Array();

    // When
    const detailItemList = pos.getDetailItemList(inventory, barcodes, initList);
    const expected = [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            quantity: 2,
            unit: '瓶',
            price: 3.00,
            subtotal: 6.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            quantity: 3,
            unit: '瓶',
            price: 3.00,
            subtotal: 9.00
        }
    ];

    // Then
    expect(detailItemList).toEqual(expected);

});