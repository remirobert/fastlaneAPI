//
//  AppDelegate.swift
//  FastlneIOS
//
//  Created by Remi Robert on 17/11/15.
//  Copyright © 2015 Remi Robert. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        let navigationBar = UINavigationBar.appearance()
        navigationBar.barStyle = .Black
        navigationBar.tintColor = UIColor(white: 0, alpha: 0.6)
        return true
    }
}

