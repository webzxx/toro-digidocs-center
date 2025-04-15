/**   
 * This API Route will serve as a learning material instead.
 * Moved to server action, see src/actions/payment.ts
 * 
 * USAGE:
 
  const response = await fetch('/api/certificates/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      certificateId,
      deliveryMethod,
      includeShipping: deliveryMethod === 'delivery'
    }),
  });

*/


// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import getSession from '@/lib/auth/getSession';
// import paymaya from '@api/paymaya';

// export async function POST(request: Request) {
//   try {
//     const session = await getSession();
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: 'You must be logged in to process payments' },
//         { status: 401 }
//       );
//     }

//     const { certificateId, includeShipping = false } = await request.json();
    
//     if (!certificateId) {
//       return NextResponse.json(
//         { error: 'Certificate ID is required for payment processing' },
//         { status: 400 }
//       );
//     }

//     const certificate = await db.certificateRequest.findUnique({
//       where: {
//         id: certificateId,
//       },
//       include: {
//         resident: {
//           include: {
//             address: true,
//           }
//         }
//       }
//     });

//     if (!certificate) {
//       return NextResponse.json(
//         { error: 'Certificate not found with the provided ID' },
//         { status: 404 }
//       );
//     }
//     if (certificate.status !== 'AWAITING_PAYMENT') {
//       return NextResponse.json(
//         { error: 'This certificate is not ready for payment' },
//         { status: 400 }
//       );
//     }
//     if (!certificate.resident) {
//       return NextResponse.json(
//         { error: 'Resident information is missing for this certificate' },
//         { status: 404 }
//       );
//     }
    
//     const resident = certificate.resident;
//     if (!resident.address) {
//       return NextResponse.json(
//         { error: 'Resident address information is required for payment' },
//         { status: 404 }
//       );
//     }
//     const address = resident.address;
//     const line1 = `${address.blockLot || ''} ${address.phase || ''}`;
//     const line2 = `${address.street || ''}, ${address.subdivision}, ${address.barangay}`;
//     const transactionRef = generateTransactionRef();
        
//     // Check if payment already exists for this certificate
//     const existingPayment = await db.payment.findFirst({
//       where: {
//         certificateRequestId: certificateId,
//         paymentStatus: {
//           in: ['PENDING']
//         },
//         isActive: true,
//       }
//     });

//     if (existingPayment) {
//       // If payment exists and is pending, return early with existing checkout URL
//       if (existingPayment.metadata && (existingPayment.metadata as any).redirectUrl) {
//         return NextResponse.json({
//           checkoutUrl: (existingPayment.metadata as any).redirectUrl,
//           transactionId: existingPayment.transactionReference
//         });
//       }
//     }
    
//     // Calculate total amount based on shipping option
//     const processingFee = 280;
//     const serviceCharge = 20;
//     const baseAmount = processingFee + serviceCharge;
//     const shippingFee = includeShipping ? 50 : 0;
//     const totalAmount = baseAmount + shippingFee;
    
//     // Get the host from request headers
//     const host = request.headers.get('host') || 'localhost:3000';
//     const protocol = host.includes('localhost') ? 'http' : 'https';
//     const baseUrl = `${protocol}://${host}`;

//     // Create PayMaya checkout
//     paymaya.auth('pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah', 'sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl');
//     const { data } = await paymaya.createV1Checkout({
//       totalAmount: {
//         currency: 'PHP',
//         value: totalAmount,
//         details: {
//           processingFee: processingFee.toFixed(2),
//           serviceCharge: serviceCharge.toFixed(2),
//           shippingFee: shippingFee.toFixed(2),
//         }
//       },
//       buyer: {
//         contact: {phone: resident.contact, email: resident.email || session.user.email!},
//         billingAddress: {
//           line1: line1,
//           line2: line2,
//           city: address.city,
//           state: 'Metro Manila',
//           zipCode: '1106',
//           countryCode: 'PH'
//         },
//         shippingAddress: {
//           firstName: resident.firstName,
//           lastName: resident.lastName,
//           phone: resident.contact,
//           email: resident.email || session.user.email!,
//           // shippingType: 'SD', optional; SD -same day shipping, ST -standard shipping (just showing the options)
//           line1: line1,
//           line2: line2,
//           city:  address.city,
//           state: 'Metro Manila',
//           zipCode: '1106',
//           countryCode: 'PH'
//         },
//         firstName: resident.firstName,
//         lastName: resident.lastName,
//       },
//       redirectUrl: {
//         success: `${baseUrl}/payment/success?id=${transactionRef}`,
//         failure: `${baseUrl}/payment/failure?id=${transactionRef}`,
//         cancel: `${baseUrl}/payment/cancel?id=${transactionRef}`,
//       },
//       items: [
//         {
//           name: `${certificate.certificateType} Certificate`,
//           code: certificate.referenceNumber,
//           description: `Certificate for ${resident.firstName} ${resident.lastName}`,
//           quantity: '1',
//           amount: {value: baseAmount},
//           totalAmount: {value: totalAmount}
//         }
//       ],
//       requestReferenceNumber: transactionRef,
//     })

//     // Save payment record in database
//     await db.payment.create({
//       data: {
//         transactionReference: transactionRef,
//         certificateRequestId: certificateId,
//         amount: totalAmount,
//         paymentMethod: 'MAYA',
//         paymentStatus: 'PENDING',
//         metadata: {
//           checkoutId: data.checkoutId,
//           redirectUrl: data.redirectUrl,
//           includeShipping: includeShipping,
//           shippingFee: shippingFee
//         }
//       }
//     });

//     // Return the checkout URL for the client to redirect to
//     return NextResponse.json({
//       checkoutUrl: data.redirectUrl,
//       transactionId: transactionRef
//     });
//   } catch (error) {
//     console.error('Payment processing error:', error);
//     return NextResponse.json(
//       { error: 'Unable to initialize payment gateway. Please try again later.' },
//       { status: 500 }
//     );
//   }
// }