// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {ChangeEvent, FormEvent} from 'react';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {Link} from 'react-router-dom';

import type {OutgoingOAuthConnection} from '@mattermost/types/integrations';
import type {Team} from '@mattermost/types/teams';

import {Permissions} from 'mattermost-redux/constants';

import BackstageHeader from 'components/backstage/components/backstage_header';
import FormError from 'components/form_error';
import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import SpinnerButton from 'components/spinner_button';

import {localizeMessage} from 'utils/utils';

type Props = {

    /**
   * The current team
   */
    team: Team;

    /**
   * The header text to render, has id and defaultMessage
   */
    header: MessageDescriptor;

    /**
   * The footer text to render, has id and defaultMessage
   */
    footer: MessageDescriptor;

    /**
   * The spinner loading text to render, has id and defaultMessage
   */
    loading: MessageDescriptor;

    /**
   * Any extra component/node to render
   */
    renderExtra?: JSX.Element;

    /**
    * The server error text after a failed action
    */
    serverError: string;

    initialConnection?: OutgoingOAuthConnection;

    /**
    * The async function to run when the action button is pressed
    */
    action: (connection: OutgoingOAuthConnection) => Promise<void>;

}

type State = {
    name: string;

    // description: string;
    // homepage: string;
    // icon_url: string;
    audienceUrls: string;
    // is_trusted: boolean;
    // has_icon: boolean;
    saving: boolean;
    clientError: JSX.Element | null | string;
};

export default class AbstractOutgoingOAuthConnection extends React.PureComponent<Props, State> {
    // private image: HTMLImageElement;
    // private icon_url: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        // this.image = new Image();
        // this.image.onload = this.imageLoaded;
        // this.icon_url = React.createRef();

        this.state = this.getStateFromConnection(this.props.initialConnection || {} as OutgoingOAuthConnection);
    }

    getStateFromConnection = (connection: OutgoingOAuthConnection) => {
        return {
            name: connection.name || '',

            // description: connection.description || '',
            // homepage: connection.homepage || '',
            // icon_url: connection.icon_url || '',
            // callbackUrls: connection.callback_urls ? connection.callback_urls.join('\n') : '',
            // is_trusted: connection.is_trusted || false,
            // has_icon: Boolean(connection.icon_url),
            saving: false,
            clientError: null,
        };
    };

    // imageLoaded = () => {
    //     if (this.icon_url.current?.value) {
    //         this.setState({
    //             has_icon: true,
    //             icon_url: this.icon_url.current.value,
    //         });
    //     }
    // };

    handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (this.state.saving) {
            return;
        }

        this.setState({
            saving: true,
            clientError: '',
        });

        if (!this.state.name) {
            this.setState({
                saving: false,
                clientError: (
                    <FormattedMessage
                        id='add_oauth_app.nameRequired'
                        defaultMessage='Name for the OAuth connection is required.'
                    />
                ),
            });

            return;
        }

        // if (!this.state.description) {
        //     this.setState({
        //         saving: false,
        //         clientError: (
        //             <FormattedMessage
        //                 id='add_oauth_app.descriptionRequired'
        //                 defaultMessage='Description for the OAuth 2.0 application is required.'
        //             />
        //         ),
        //     });

        //     return;
        // }

        // if (!this.state.homepage) {
        //     this.setState({
        //         saving: false,
        //         clientError: (
        //             <FormattedMessage
        //                 id='add_oauth_app.homepageRequired'
        //                 defaultMessage='Homepage for the OAuth 2.0 application is required.'
        //             />
        //         ),
        //     });

        //     return;
        // }

        const audienceUrls = [];
        for (let audienceUrl of this.state.audienceUrls.split('\n')) {
            audienceUrl = audienceUrl.trim();

            if (audienceUrl.length > 0) {
                audienceUrls.push(audienceUrl);
            }
        }

        if (audienceUrls.length === 0) {
            this.setState({
                saving: false,
                clientError: (
                    <FormattedMessage
                        id='add_oauth_app.callbackUrlsRequired'
                        defaultMessage='One or more audience URLs are required.'
                    />
                ),
            });

            return;
        }

        const connection = {
            name: this.state.name,
            audiences: audienceUrls,

            // homepage: this.state.homepage,
            // description: this.state.description,
            // is_trusted: this.state.is/_trusted,
            // icon_url: this.state.icon_url,
        } as OutgoingOAuthConnection;

        this.props.action(connection).then(() => this.setState({saving: false}));
    };

    updateName = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value,
        });
    };

    // updateTrusted = (e: ChangeEvent<HTMLInputElement>) => {
    //     this.setState({
    //         is_trusted: e.target.value === 'true',
    //     });
    // };

    // updateDescription = (e: ChangeEvent<HTMLInputElement>) => {
    //     this.setState({
    //         description: e.target.value,
    //     });
    // };

    // updateHomepage = (e: ChangeEvent<HTMLInputElement>) => {
    //     this.setState({
    //         homepage: e.target.value,
    //     });
    // };

    // updateIconUrl = (e: ChangeEvent<HTMLInputElement>) => {
    //     this.setState({
    //         has_icon: false,
    //         icon_url: e.target.value,
    //     });
    //     this.image.src = e.target.value;
    // };

    updateAudienceUrls = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            audienceUrls: e.target.value,
        });
    };

    render() {
        const headerToRender = this.props.header;
        const footerToRender = this.props.footer;
        const renderExtra = this.props.renderExtra;

        let icon;
        // if (this.state.has_icon) {
        //     icon = (
        //         <div className='integration__icon'>
        //             <img
        //                 alt={'integration icon'}
        //                 src={this.state.icon_url}
        //             />
        //         </div>
        //     );
        // }

        // const trusted = (
        //     <SystemPermissionGate permissions={[Permissions.MANAGE_SYSTEM]}>
        //         <div className='form-group'>
        //             <label
        //                 className='control-label col-sm-4'
        //                 htmlFor='is_trusted'
        //             >
        //                 <FormattedMessage
        //                     id='installed_oauth_apps.trusted'
        //                     defaultMessage='Is Trusted'
        //                 />
        //             </label>
        //             <div className='col-md-5 col-sm-8'>
        //                 <label className='radio-inline'>
        //                     <input
        //                         type='radio'
        //                         value='true'
        //                         name='is_trusted'
        //                         checked={this.state.is_trusted}
        //                         onChange={this.updateTrusted}
        //                     />
        //                     <FormattedMessage
        //                         id='installed_oauth_apps.trusted.yes'
        //                         defaultMessage='Yes'
        //                     />
        //                 </label>
        //                 <label className='radio-inline'>
        //                     <input
        //                         type='radio'
        //                         value='false'
        //                         name='is_trusted'
        //                         checked={!this.state.is_trusted}
        //                         onChange={this.updateTrusted}
        //                     />
        //                     <FormattedMessage
        //                         id='installed_oauth_apps.trusted.no'
        //                         defaultMessage='No'
        //                     />
        //                 </label>
        //                 <div className='form__help'>
        //                     <FormattedMessage
        //                         id='add_oauth_app.trusted.help'
        //                         defaultMessage='If true, the OAuth 2.0 application is considered trusted by the Mattermost server and does not require the user to accept authorization. If false, a window opens to ask the user to accept or deny the authorization.'
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //     </SystemPermissionGate>
        // );

        return (
            <div className='backstage-content'>
                <BackstageHeader>
                    <Link to={`/${this.props.team.name}/integrations/outgoing-oauth2-connections`}>
                        <FormattedMessage
                            id='installed_oauth_apps.header'
                            defaultMessage='Installed Outgoing OAuth Connections'
                        />
                    </Link>
                    <FormattedMessage
                        id={headerToRender.id}
                        defaultMessage={headerToRender.defaultMessage}
                    />
                </BackstageHeader>
                <div className='backstage-form'>
                    {icon}
                    <form className='form-horizontal'>
                        {/* {trusted} */}
                        <div className='form-group'>
                            <label
                                className='control-label col-sm-4'
                                htmlFor='name'
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.name'
                                    defaultMessage='Display Name'
                                />
                            </label>
                            <div className='col-md-5 col-sm-8'>
                                <input
                                    id='name'
                                    type='text'
                                    maxLength={64}
                                    className='form-control'
                                    value={this.state.name}
                                    onChange={this.updateName}
                                />
                                <div className='form__help'>
                                    <FormattedMessage
                                        id='add_oauth_app.name.help'
                                        defaultMessage='Specify the display name, of up to 64 characters, for your OAuth connection.'
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className='form-group'>
                            <label
                                className='control-label col-sm-4'
                                htmlFor='description'
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.description'
                                    defaultMessage='Description'
                                />
                            </label>
                            <div className='col-md-5 col-sm-8'>
                                <input
                                    id='description'
                                    type='text'
                                    maxLength={512}
                                    className='form-control'
                                    value={this.state.description}
                                    onChange={this.updateDescription}
                                />
                                <div className='form__help'>
                                    <FormattedMessage
                                        id='add_oauth_app.description.help'
                                        defaultMessage='Describe your OAuth 2.0 application.'
                                    />
                                </div>
                            </div>
                        </div> */}
                        {/* <div className='form-group'>
                            <label
                                className='control-label col-sm-4'
                                htmlFor='homepage'
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.homepage'
                                    defaultMessage='Homepage'
                                />
                            </label>
                            <div className='col-md-5 col-sm-8'>
                                <input
                                    id='homepage'
                                    type='url'
                                    maxLength={256}
                                    className='form-control'
                                    value={this.state.homepage}
                                    onChange={this.updateHomepage}
                                />
                                <div className='form__help'>
                                    <FormattedMessage
                                        id='add_oauth_app.homepage.help'
                                        defaultMessage='This is the URL for the homepage of the OAuth 2.0 application. Depending on your server configuration, use HTTP or HTTPS in the URL.'
                                    />
                                </div>
                            </div>
                        </div> */}
                        {/* <div className='form-group'>
                            <label
                                className='control-label col-sm-4'
                                htmlFor='icon_url'
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.iconUrl'
                                    defaultMessage='Icon URL'
                                />
                            </label>
                            <div className='col-md-5 col-sm-8'>
                                <input
                                    id='icon_url'
                                    ref={this.icon_url}
                                    type='url'
                                    maxLength={512}
                                    className='form-control'
                                    value={this.state.icon_url}
                                    onChange={this.updateIconUrl}
                                />
                                <div className='form__help'>
                                    <FormattedMessage
                                        id='add_oauth_app.icon.help'
                                        defaultMessage='(Optional) The URL of the image used for your OAuth 2.0 application. Make sure you use HTTP or HTTPS in your URL.'
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div className='form-group'>
                            <label
                                className='control-label col-sm-4'
                                htmlFor='audienceUrls'
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.audienceUrls'
                                    defaultMessage='Audience URLs (One Per Line)'
                                />
                            </label>
                            <div className='col-md-5 col-sm-8'>
                                <textarea
                                    id='audienceUrls'
                                    rows={3}
                                    maxLength={1024}
                                    className='form-control'
                                    value={this.state.audienceUrls}
                                    onChange={this.updateAudienceUrls}
                                />
                                <div className='form__help'>
                                    <FormattedMessage
                                        id='add_oauth_app.audienceUrls.help'
                                        defaultMessage='The redirect URIs to which the service will redirect users after accepting or denying authorization of your application, and which will handle authorization codes or access tokens. Must be a valid URL and start with http:// or https://.'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='backstage-form__footer'>
                            <FormError
                                type='backstage'
                                errors={[this.props.serverError, this.state.clientError]}
                            />
                            <Link
                                className='btn btn-tertiary'
                                to={`/${this.props.team.name}/integrations/outgoing-oauth2-connections`}
                            >
                                <FormattedMessage
                                    id='installed_oauth_apps.cancel'
                                    defaultMessage='Cancel'
                                />
                            </Link>
                            <SpinnerButton
                                className='btn btn-primary'
                                type='submit'
                                spinning={this.state.saving}
                                spinningText={localizeMessage(this.props.loading?.id || '', (this.props.loading?.defaultMessage || '') as string)}
                                onClick={this.handleSubmit}
                                id='saveOauthApp'
                            >
                                <FormattedMessage
                                    id={footerToRender.id}
                                    defaultMessage={footerToRender.defaultMessage}
                                />
                            </SpinnerButton>
                            {renderExtra}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
