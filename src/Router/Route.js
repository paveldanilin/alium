export default class Route
{
    constructor(path) {
        this._path          = path;
        this._routeData     = this._parse(path);
        this._parameters    = {};
    }

    static create(path)
    {
        return new Route(path);
    }

    match(uri)
    {
        this._parameters = {};

        const segments = uri.split('/');

        if (segments.length !== this._routeData.length) {
            return false;
        }

        for (let i = 0 ; i < segments.length ; i++) {
            const routeSegment = this._routeData[i];

            if (routeSegment.type === 'segment' && routeSegment.value !== segments[i]) {
                this._parameters = {};
                return false;
            }

            if (routeSegment.type === 'param') {
                let parameterValue = segments[i];

                if (routeSegment.filter !== null) {
                    try {
                        parameterValue = this._filterValue(routeSegment.value, routeSegment.filter, parameterValue)
                    } catch (e) {
                        this._parameters = {};
                        return false;
                    }
                }

                this._parameters[routeSegment.value] = parameterValue;
            }
        }

        return true;
    }

    get parameters()
    {
        return this._parameters;
    }

    get path()
    {
        return this._path;
    }

    _filterValue(parameter, filter, value)
    {
        switch (filter) {
            case 'number':
                const filteredValue = +value;
                if (isNaN(filteredValue)) {
                    throw new Error('Could not convert to number');
                }
                return filteredValue;
        }

        throw new Error(`Unknown filter ${filter}`);
    }

    _parse(path)
    {
        const routeData = path.split('/');

        for (let i = 0 ; i < routeData.length ; i++) {
            const segment = routeData[i];

            const segmentStart = segment.charAt(0);
            const segmentLast  = segment.charAt(segment.length - 1);

            if (segmentStart === '{' && segmentLast === '}') {
                let parameterName = segment.substr(1, segment.length - 2);
                let filter = null;

                if (parameterName.includes(':')) {
                    const p = parameterName.split(':');
                    parameterName = p[0];
                    filter = p[1].toLowerCase();
                }

                routeData[i] = {
                    type: 'param',
                    value: parameterName,
                    filter: filter
                };
            } else {
                routeData[i] = {
                    type: 'segment',
                    value: segment
                };
            }
        }

        return routeData;
    }
}
