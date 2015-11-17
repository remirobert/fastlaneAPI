//
//  CustomersViewController.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit
import SnapKit

class CustomersViewController: UIViewController {

    var customerController: CustomersController!
    var tableView: UITableView!
    
    @IBAction func refreshCustomerList(sender: AnyObject) {
        self.customerController.fetchCustomerList()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.customerController = CustomersController(delegate: self)
        self.customerController.fetchCustomerList()
        
        
        self.tableView = UITableView()
        self.view.addSubview(self.tableView)
        self.tableView.snp_makeConstraints { (make) -> Void in
            make.edges.equalTo(self.view)
        }
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.tableView.registerNib(UINib(nibName: "CustomerTableViewCell", bundle: nil), forCellReuseIdentifier: "customerCell")
    }
}

extension CustomersViewController: CustomersControllerDelegate {

    func getCustomersList() {
        self.tableView.reloadData()
    }
}

extension CustomersViewController: UITableViewDataSource {
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.customerController.customers.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("customerCell") as! CustomerTableViewCell
        
        cell.bindCustomerCell(self.customerController.customers[indexPath.row])
        return cell
    }
}

extension CustomersViewController: UITableViewDelegate {
    
}