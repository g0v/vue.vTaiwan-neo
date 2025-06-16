# [Vue 3] Extraneous non-props attributes warning with JaaSMeeting component

**Repository**: https://github.com/jitsi/jitsi-meet-vue-sdk  
**Issue Type**: Bug  
**Priority**: Medium  
**Status**: To be reported  
**Date**: 2025-06-16

## Bug Description

When using the `JaaSMeeting` component in Vue 3, the following warning appears in the development console:

```
[Vue warn]: Extraneous non-props attributes (appId, useStaging) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.
```

## Steps to Reproduce

1. Create a Vue 3 project
2. Install `@jitsi/vue-sdk@^1.0.4`
3. Use the JaaSMeeting component with required props:

```vue
<template>
  <div class="w-full h-screen" v-if="jwt">
    <JaaSMeeting
      :app-id="appId"
      :room-name="fullRoomName"
      :jwt="jwt"
      :use-staging="false"
      lang="zh-TW"
      @get-iframe-ref-on-api-ready="onIframeReady"
      @on-api-ready="onApiReady"
    />
  </div>
</template>

<script>
import { JaaSMeeting } from '@jitsi/vue-sdk';

export default {
  components: { JaaSMeeting },
  data() {
    return {
      appId: 'your-app-id',
      fullRoomName: 'your-room-name',
      jwt: 'your-jwt-token'
    };
  },
  methods: {
    onIframeReady(parentNode) {
      // iframe ready handler
    },
    onApiReady(api) {
      // api ready handler
    }
  }
};
</script>
```

## Expected Behavior

No warnings should appear when using the component with valid props.

## Actual Behavior

Vue warns about extraneous non-props attributes, even though the props are correctly defined according to the documentation.

## Environment

- **Vue version**: 3.4.0
- **@jitsi/vue-sdk version**: 1.0.4
- **Node version**: Latest LTS
- **Browser**: Chrome/Firefox/Safari (all affected)
- **OS**: macOS/Windows/Linux (all affected)

## Additional Context

This appears to be related to how Vue 3 handles prop inheritance for components that render fragment or teleport root nodes. The warning suggests that the component's internal structure may not be properly handling attribute inheritance.

The functionality works correctly despite the warning, but it creates noise in the development console and may confuse developers.

## Possible Solutions

1. Ensure the component has a single root element, or
2. Use `inheritAttrs: false` and manually handle attribute binding with `useAttrs()`, or
3. Update the component's prop definitions to match the actual implementation

## Workaround

For now, developers can suppress this specific warning using Vue's `warnHandler`:

```javascript
app.config.warnHandler = (msg, instance, trace) => {
  if (msg.includes('Extraneous non-props attributes') && msg.includes('appId')) {
    return
  }
  console.warn(msg, trace)
}
```

## Related Issues

This is similar to Vue core issue: https://github.com/vuejs/core/issues/5933

## Notes

- The issue only appears in development mode
- Functionality is not affected
- This is a common issue with Vue 3 components that don't properly handle attribute inheritance
- May be related to the component's internal structure using fragments or teleport nodes 