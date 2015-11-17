//
//  CustomerTableViewCell.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit

class CustomerTableViewCell: UITableViewCell {

    @IBOutlet weak var labelPhoneNumber: UILabel!
    @IBOutlet weak var labelPositionQueue: UILabel!
    
    func bindCustomerCell(customer: Customer) {
        self.labelPhoneNumber.text = customer.phoneNumber
        self.labelPositionQueue.text = "\(customer.position)"
    }
}
