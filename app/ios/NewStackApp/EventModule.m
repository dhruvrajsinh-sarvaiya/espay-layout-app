#import "NativeEventModule.h"

@implementation ModuleWithEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSessionConnect"];
}

- (void)tellJS {
  [self sendEventWithName:@"onSessionConnect" body:@{@"sessionId": session.sessionId}];
}

@end
