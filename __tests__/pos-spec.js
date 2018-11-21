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