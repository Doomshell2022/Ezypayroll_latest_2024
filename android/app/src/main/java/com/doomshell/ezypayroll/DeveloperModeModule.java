package com.doomshell.ezypayroll;

import android.content.Context;
import android.provider.Settings;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeveloperModeModule extends ReactContextBaseJavaModule {

    public DeveloperModeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DeveloperMode";
    }

    @ReactMethod
    public void isDeveloperModeEnabled(Promise promise) {
        Context context = getReactApplicationContext();
        boolean isEnabled = Settings.Secure.getInt(context.getContentResolver(),
                Settings.Secure.DEVELOPMENT_SETTINGS_ENABLED , 0) != 0;
        promise.resolve(isEnabled);
    }
}
