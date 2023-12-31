// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    permissions: string[];

    /**
     * Has permission
     * This prop is will always be passed by the mapStateToProps function
     * it should be required when this component is converted to TS, for now its optional to make the TS compiler quite.
     * about this prop not being passed from where this component is used
     */
    hasPermission: boolean;

    /**
     * Invert the permission (used for else)
     */
    invert?: boolean;

    /**
     * Content protected by the permissions gate
     */
    children: React.ReactNode;
};

const SystemPermissionGate = ({
    invert = false,
    hasPermission,
    children,
}: Props) => {
    if (hasPermission !== invert) {
        return <>{children}</>;
    }
    return null;
};

export default SystemPermissionGate;
