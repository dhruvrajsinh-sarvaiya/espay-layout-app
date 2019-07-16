package com.newstackapp;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

public class PackageCheckerModule extends ReactContextBaseJavaModule {

    public PackageCheckerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PackageChecker";
    }

    @ReactMethod
    public void isAuthAvailable(Promise promise) {
        final PackageManager pm = getCurrentActivity().getPackageManager();

        //get a list of installed apps.
        List<ApplicationInfo> packages = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        boolean hasAuthenticator = false;
        String authenticatorPackage = "com.google.android.apps.authenticator2";
        for (ApplicationInfo packageInfo : packages) {
            if (authenticatorPackage.equals(packageInfo.packageName)) {
                hasAuthenticator = true;
            }
        }

        promise.resolve(hasAuthenticator);
    }

    @ReactMethod
    public void openSettings(){
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getCurrentActivity().getPackageName(), null);
        intent.setData(uri);
        getCurrentActivity().startActivity(intent);
    }
}
