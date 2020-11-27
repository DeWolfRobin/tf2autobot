declare module 'steam-user' {
    import { EventEmitter } from 'events';
    import SteamID from 'steamid';

    interface Events {
        loggedOn: () => void;
        webSession: (sessionID: string, cookies: string) => void;
        accountLimitations: (
            limited: boolean,
            communityBanned: boolean,
            locked: boolean,
            canInviteFriends: boolean
        ) => void;
        friendMessage: (senderID: SteamID, message: string) => void;
        friendRelationship: (steamID: SteamID, relationship: number) => void;
        groupRelationship: (groupID: SteamID, relationship: number) => void;
        steamGuard: (domain: string, callback: (authCode: string) => void, lastCodeWrong: boolean) => void;
        loginKey: (loginKey: string) => void;
        error: (err: Error) => void;
    }

    export enum EResult {
        Invalid = 0,

        OK = 1,
        Fail = 2,
        NoConnection = 3,
        InvalidPassword = 5,
        LoggedInElsewhere = 6,
        InvalidProtocolVer = 7,
        InvalidParam = 8,
        FileNotFound = 9,
        Busy = 10,
        InvalidState = 11,
        InvalidName = 12,
        InvalidEmail = 13,
        DuplicateName = 14,
        AccessDenied = 15,
        Timeout = 16,
        Banned = 17,
        AccountNotFound = 18,
        InvalidSteamID = 19,
        ServiceUnavailable = 20,
        NotLoggedOn = 21,
        Pending = 22,
        EncryptionFailure = 23,
        InsufficientPrivilege = 24,
        LimitExceeded = 25,
        Revoked = 26,
        Expired = 27,
        AlreadyRedeemed = 28,
        DuplicateRequest = 29,
        AlreadyOwned = 30,
        IPNotFound = 31,
        PersistFailed = 32,
        LockingFailed = 33,
        LogonSessionReplaced = 34,
        ConnectFailed = 35,
        HandshakeFailed = 36,
        IOFailure = 37,
        RemoteDisconnect = 38,
        ShoppingCartNotFound = 39,
        Blocked = 40,
        Ignored = 41,
        NoMatch = 42,
        AccountDisabled = 43,
        ServiceReadOnly = 44,
        AccountNotFeatured = 45,
        AdministratorOK = 46,
        ContentVersion = 47,
        TryAnotherCM = 48,
        PasswordRequiredToKickSession = 49,
        AlreadyLoggedInElsewhere = 50,
        Suspended = 51,
        Cancelled = 52,
        DataCorruption = 53,
        DiskFull = 54,
        RemoteCallFailed = 55,
        PasswordNotSet = 56, // removed "renamed to PasswordUnset"
        PasswordUnset = 56,
        ExternalAccountUnlinked = 57,
        PSNTicketInvalid = 58,
        ExternalAccountAlreadyLinked = 59,
        RemoteFileConflict = 60,
        IllegalPassword = 61,
        SameAsPreviousValue = 62,
        AccountLogonDenied = 63,
        CannotUseOldPassword = 64,
        InvalidLoginAuthCode = 65,
        AccountLogonDeniedNoMailSent = 66, // removed "renamed to AccountLogonDeniedNoMail"
        AccountLogonDeniedNoMail = 66,
        HardwareNotCapableOfIPT = 67,
        IPTInitError = 68,
        ParentalControlRestricted = 69,
        FacebookQueryError = 70,
        ExpiredLoginAuthCode = 71,
        IPLoginRestrictionFailed = 72,
        AccountLocked = 73, // removed "renamed to AccountLockedDown"
        AccountLockedDown = 73,
        AccountLogonDeniedVerifiedEmailRequired = 74,
        NoMatchingURL = 75,
        BadResponse = 76,
        RequirePasswordReEntry = 77,
        ValueOutOfRange = 78,
        UnexpectedError = 79,
        Disabled = 80,
        InvalidCEGSubmission = 81,
        RestrictedDevice = 82,
        RegionLocked = 83,
        RateLimitExceeded = 84,
        AccountLogonDeniedNeedTwoFactorCode = 85, // removed "renamed to AccountLoginDeniedNeedTwoFactor"
        AccountLoginDeniedNeedTwoFactor = 85,
        ItemOrEntryHasBeenDeleted = 86, // removed "renamed to ItemDeleted"
        ItemDeleted = 86,
        AccountLoginDeniedThrottle = 87,
        TwoFactorCodeMismatch = 88,
        TwoFactorActivationCodeMismatch = 89,
        AccountAssociatedToMultiplePlayers = 90, // removed "renamed to AccountAssociatedToMultiplePartners"
        AccountAssociatedToMultiplePartners = 90,
        NotModified = 91,
        NoMobileDeviceAvailable = 92, // removed "renamed to NoMobileDevice"
        NoMobileDevice = 92,
        TimeIsOutOfSync = 93, // removed "renamed to TimeNotSynced"
        TimeNotSynced = 93,
        SMSCodeFailed = 94,
        TooManyAccountsAccessThisResource = 95, // removed "renamed to AccountLimitExceeded"
        AccountLimitExceeded = 95,
        AccountActivityLimitExceeded = 96,
        PhoneActivityLimitExceeded = 97,
        RefundToWallet = 98,
        EmailSendFailure = 99,
        NotSettled = 100,
        NeedCaptcha = 101,
        GSLTDenied = 102,
        GSOwnerDenied = 103,
        InvalidItemType = 104,
        IPBanned = 105,
        GSLTExpired = 106,
        InsufficientFunds = 107,
        TooManyPending = 108,
        NoSiteLicensesFound = 109,
        WGNetworkSendExceeded = 110
    }

    export enum EPersonaState {
        Offline = 0,

        Online = 1,
        Busy = 2,
        Away = 3,
        Snooze = 4,
        LookingToTrade = 5,
        LookingToPlay = 6,

        Max = 7
    }

    export enum EClanRelationship {
        None = 0,
        Blocked = 1,
        Invited = 2,
        Member = 3,
        Kicked = 4,
        KickAcknowledged = 5
    }

    export enum EFriendRelationship {
        None = 0,

        Blocked = 1,
        RequestRecipient = 2,
        Friend = 3,
        RequestInitiator = 4,
        Ignored = 5,
        IgnoredFriend = 6,
        SuggestedFriend = 7,

        Max = 8
    }

    export default class SteamUser extends EventEmitter {
        steamID: SteamID;

        limitations: {
            limited: boolean;
            communityBanned: boolean;
            locked: boolean;
            canInviteFriends: boolean;
        };

        users: Map<
            SteamID,
            {
                rich_precense: any[];
                player_name: string;
                avater_hash: Buffer;
                last_logoff: Date;
                last_logon: Date;
                last_seen_online: Date;
                avatar_url_icon: string;
                avatar_url_medium: string;
                avatar_url_full: string;
            }
        >;

        myGroups: Map<SteamID, EClanRelationship>;

        myFriends: Map<SteamID, EFriendRelationship>;

        autoRelogin: boolean;

        _playingAppIds: number[];

        logOn(details: {
            accountName: string;
            password?: string;
            loginKey?: string;
            twoFactorCode?: string;
            rememberPassword?: boolean;
        }): void;

        webLogOn(): void;

        setPersona(state: number, name?: string): void;

        gamesPlayed(apps: any[] | string | number, force?: boolean): void;

        chatMessage(recipient: SteamID | string, message: string): void;

        addFriend(steamID: SteamID | string, callback?: (err: Error | null, personaName?: string) => void): void;

        removeFriend(steamID: SteamID | string): void;

        blockUser(steamID: SteamID | string, callback?: (err: Error | null) => void): void;

        unblockUser(steamID: SteamID | string, callback?: (err: Error | null) => void): void;

        respondToGroupInvite(groupSteamID: SteamID | string, accept: boolean): void;

        logOff(): void;
    }
}
