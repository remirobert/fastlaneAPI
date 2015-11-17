//
//  CustomersViewController.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit

class CustomersViewController: UIViewController {

    var customerController: CustomersController!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.customerController = CustomersController(delegate: self)
    }
}

extension CustomersViewController: CustomersControllerDelegate {

    func getCustomersList(customers: [Customer]?) {
        
    }
}
