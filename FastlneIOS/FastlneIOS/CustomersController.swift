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
    func getCustomersList()
}

class CustomersController {

    private let delegate: CustomersControllerDelegate?
    private let url = "http://127.0.0.1:3000/customers"
    
    var customers = Array<Customer>()
    
    init(delegate: CustomersControllerDelegate?) {
        self.delegate = delegate
    }
    
    func fetchCustomerList() {
        
        Alamofire.request(.GET, url, parameters: nil, encoding: ParameterEncoding.JSON, headers: nil).responseJSON { response in
            print("repsonse : \(response.result.value!)")
            if let rep = response.result.value as? [String] {
                print("final rep : \(rep.first as? NSDictionary)")
            }
            
            if let response = response.result.value as? [NSDictionary] {
                print("get response : \(response)")
                self.customers = Customer.customersFromJSONResponse(response)
                self.delegate?.getCustomersList()
            }
        }
    }
}
