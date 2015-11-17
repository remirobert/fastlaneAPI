//
//  Customer.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit

class Customer {
    var phoneNumber: String!
    var position: Int!
    
    init(userInformation: NSDictionary, positionInQueue: Int) {
        self.phoneNumber = userInformation.objectForKey("phone") as! String
    }
    
    class func customersFromJSONResponse(responses: [NSDictionary]) -> [Customer] {
        var customers = Array<Customer>()
        var currentPosition = 1
        
        for currentUserDictionary in responses {
            customers.append(Customer(userInformation: currentUserDictionary, positionInQueue: currentPosition))
            currentPosition += 1
        }
        return customers
    }
}
