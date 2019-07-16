//
//  GlobalEventEmitter.m
//  NewStackApp

#import "GlobalEventEmitter.h"
#import <React/RCTLog.h>

@implementation GlobalEventEmitter

// To export a module named GlobalEventEmitter
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EMITTER"];
}

RCT_EXPORT_METHOD(emit:(NSDictionary *)arg)
{
  [self sendEventWithName:@"EMITTER" body:@{@"arg": arg}];
}
@end
