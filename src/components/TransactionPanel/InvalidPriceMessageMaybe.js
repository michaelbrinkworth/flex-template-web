// import React from 'react';
// import Decimal from 'decimal.js';
// import {
//   LINE_ITEM_NIGHT,
//   LINE_ITEM_PROVIDER_COMMISSION,
// } from '../../util/types';
// import { nightsBetween, daysBetween } from '../../util/dates';
// import { convertMoneyToNumber } from '../../util/currency';
// import { types as sdkTypes } from '../../util/sdkLoader';
// import config from '../../config';
//
// import css from './TransactionPanel.css';
//
// const { Money } = sdkTypes;
//
// const InvalidPriceMessageMaybe = props => {
//   const { transaction, listing, transactionRole, intl } = props;
//   const loaded =
//     transaction &&
//     transaction.id &&
//     transaction.booking &&
//     transaction.booking.id;
//   if (!loaded) {
//     return null;
//   }
//
//   const unitType = config.bookingUnitType;
//
//   const isProvider = transactionRole === 'provider';
//   const isNightly = unitType === LINE_ITEM_NIGHT;
//   const { start, end } = transaction.booking.attributes;
//   const quantity = isNightly
//     ? nightsBetween(start, end)
//     : daysBetween(start, end);
//
//   // expected booking total
//   const listingUnitPrice = listing.attributes.price;
//   const listingNumericUnitPrice = convertMoneyToNumber(
//     listingUnitPrice
//   );
//   const listingUnitTotal = new Decimal(listingNumericUnitPrice)
//     .times(quantity)
//     .toNumber();
//
//   // expected delivery fee total
//   const listingDeliveryFeeData =
//     listing.attributes.publicData.deliveryFee;
//   const { amount: deliveryAmount, currency: deliveryCurrency } =
//     listingDeliveryFeeData || {};
//   const listingDeliveryFeePrice =
//     deliveryAmount && deliveryCurrency
//       ? new Money(deliveryAmount, deliveryCurrency)
//       : null;
//   const listingDeliveryFeeTotal = listingDeliveryFeePrice
//     ? convertMoneyToNumber(listingDeliveryFeePrice)
//     : null;
//
//   // provider commission
//   const providerCommissionLineItem = transaction.attributes.lineItems.find(
//     item =>
//       item.code === LINE_ITEM_PROVIDER_COMMISSION && !item.reversal
//   );
//   const providerCommissionTotal = providerCommissionLineItem
//     ? convertMoneyToNumber(providerCommissionLineItem.lineTotal)
//     : 0;
//
//   // check that the expected booking total + Delivery fee + provider commission
//   // match the payout total of the transaction
//   const payoutTotal = convertMoneyToNumber(
//     transaction.attributes.payoutTotal
//   );
//   const expectedPayoutTotal = new Decimal(listingUnitTotal)
//     .plus(listingDeliveryFeeTotal)
//     .plus(providerCommissionTotal)
//     .toNumber();
//   const priceInvalid = expectedPayoutTotal !== payoutTotal;
//
//   const message = intl.formatMessage({
//     id: 'BookingBreakdown.invalidPrice',
//   });
//   const showMessage = isProvider && priceInvalid;
//   return showMessage ? (
//     <p className={css.invalidPriceMessage}>{message}</p>
//   ) : null;
// };
//
// export default InvalidPriceMessageMaybe;
