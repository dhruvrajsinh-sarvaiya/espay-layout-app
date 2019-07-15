package com.newstackapp;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import com.newstackapp.PackageCheckerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactApplication;
import com.github.yamill.orientation.OrientationPackage;
import iyegoroff.RNTextGradient.RNTextGradientPackage;
import cl.json.RNSharePackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.imagepicker.ImagePickerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;
import org.reactnative.camera.RNCameraPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// import com.facebook.reactnative.androidsdk.FBSDKPackage;
import ui.stylesdialogs.RNStyledDialogsPackage;
// import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import java.util.Arrays;
import java.util.List;
// import com.facebook.FacebookSdk;
// import com.facebook.CallbackManager;
// import com.facebook.appevents.AppEventsLogger;
import cl.json.ShareApplication;
import com.BV.LinearGradient.LinearGradientPackage;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    // private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    // protected static CallbackManager getCallbackManager() {
    //     return mCallbackManager;
    // }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
            // return false;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new OrientationPackage(),
                    new RNTextGradientPackage(),
                    new LinearGradientPackage(),
                    new RNSharePackage(),
                    new RNExitAppPackage(),
                    new ImagePickerPackage(),
                    new ReactNativePushNotificationPackage(),
                    new FIRMessagingPackage(),
                    new RNCameraKitPackage(),
                    new RNSensitiveInfoPackage(),
                    new PackageCheckerPackage(),
                    new RNStyledDialogsPackage(),
                    new RNDeviceInfo(),
                    // new FBSDKPackage(mCallbackManager),
                    // new RNGoogleSigninPackage(),
                    new RNCameraPackage(),
                    new RNFetchBlobPackage(),
                    new ReactNativeLocalizationPackage(),
                    new WebViewBridgePackage(),
                    new NetInfoPackage(),
                    new RNGestureHandlerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
	
	@Override
    public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}