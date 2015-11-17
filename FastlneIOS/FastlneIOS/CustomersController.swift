//
//  CustomersController.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit
import Alamofire

protocol CustomersControllerDelegate {
    func getCustomersList(customers: [Customer]?)
}

class CustomersController {

    private let delegate: CustomersControllerDelegate?
    
    init(delegate: CustomersControllerDelegate?) {
        self.delegate = delegate
    }
    
    func fetchCustomerList() {
        
        Alamofire.request(.GET, "", parameters: nil, encoding: ParameterEncoding.JSON, headers: nil).responseJSON { response in
            if let response = response.result.value as? NSDictionary {
                Customer.customersFromJSONResponse(response)
            }
        }
    }
}
